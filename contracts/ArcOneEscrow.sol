// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcOneEscrow
 * @dev Milestone-based native USDC escrow for decentralized jobs & payroll on Arc Testnet (Chain ID 5042002).
 * On Arc, USDC is the native gas and settlement currency.
 */
contract ArcOneEscrow {
    enum MilestoneStatus { Pending, Funded, InReview, Released, Disputed }
    enum JobStatus { Open, InProgress, Completed, Cancelled }

    struct Milestone {
        string title;
        uint256 amountUSDC;
        MilestoneStatus status;
        uint256 completedAt;
    }

    struct Job {
        uint256 jobId;
        address employer;
        address contractor;
        uint256 totalAmountUSDC;
        uint256 fundedAmountUSDC;
        JobStatus status;
        uint256 milestoneCount;
        uint256 createdAt;
    }

    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => mapping(uint256 => Milestone)) public jobMilestones;

    // Reentrancy guard
    uint8 private _unlocked = 1;
    modifier nonReentrant() {
        require(_unlocked == 1, "REENTRANCY_GUARD");
        _unlocked = 0;
        _;
        _unlocked = 1;
    }

    modifier onlyEmployer(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].employer, "NOT_EMPLOYER");
        _;
    }

    modifier onlyContractor(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].contractor, "NOT_CONTRACTOR");
        _;
    }

    // Events
    event JobCreated(uint256 indexed jobId, address indexed employer, address indexed contractor, uint256 totalBudget);
    event EscrowFunded(uint256 indexed jobId, uint256 indexed milestoneIndex, uint256 amount);
    event MilestoneSubmitted(uint256 indexed jobId, uint256 indexed milestoneIndex);
    event MilestoneReleased(uint256 indexed jobId, uint256 indexed milestoneIndex, address contractor, uint256 amount);
    event EscrowRefunded(uint256 indexed jobId, address indexed employer, uint256 amount);

    /**
     * @notice Create a new job contract with milestones
     */
    function createJob(
        address _contractor,
        string[] memory _milestoneTitles,
        uint256[] memory _milestoneAmounts
    ) external returns (uint256) {
        require(_contractor != address(0), "INVALID_CONTRACTOR");
        require(_milestoneTitles.length > 0 && _milestoneTitles.length == _milestoneAmounts.length, "INVALID_MILESTONES");

        jobCounter++;
        uint256 newJobId = jobCounter;

        uint256 total = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            total += _milestoneAmounts[i];
            jobMilestones[newJobId][i] = Milestone({
                title: _milestoneTitles[i],
                amountUSDC: _milestoneAmounts[i],
                status: MilestoneStatus.Pending,
                completedAt: 0
            });
        }

        jobs[newJobId] = Job({
            jobId: newJobId,
            employer: msg.sender,
            contractor: _contractor,
            totalAmountUSDC: total,
            fundedAmountUSDC: 0,
            status: JobStatus.Open,
            milestoneCount: _milestoneTitles.length,
            createdAt: block.timestamp
        });

        emit JobCreated(newJobId, msg.sender, _contractor, total);
        return newJobId;
    }

    /**
     * @notice Fund a specific milestone with native USDC
     */
    function fundMilestone(uint256 _jobId, uint256 _milestoneIndex) external payable onlyEmployer(_jobId) nonReentrant {
        Job storage job = jobs[_jobId];
        Milestone storage milestone = jobMilestones[_jobId][_milestoneIndex];

        require(milestone.status == MilestoneStatus.Pending, "ALREADY_FUNDED_OR_CLOSED");
        require(msg.value == milestone.amountUSDC, "INCORRECT_USDC_AMOUNT");

        milestone.status = MilestoneStatus.Funded;
        job.fundedAmountUSDC += msg.value;
        job.status = JobStatus.InProgress;

        emit EscrowFunded(_jobId, _milestoneIndex, msg.value);
    }

    /**
     * @notice Contractor submits completed milestone for review
     */
    function submitMilestone(uint256 _jobId, uint256 _milestoneIndex) external onlyContractor(_jobId) {
        Milestone storage milestone = jobMilestones[_jobId][_milestoneIndex];
        require(milestone.status == MilestoneStatus.Funded, "MILESTONE_NOT_FUNDED");

        milestone.status = MilestoneStatus.InReview;
        emit MilestoneSubmitted(_jobId, _milestoneIndex);
    }

    /**
     * @notice Employer approves milestone deliverable and releases native USDC to contractor
     */
    function releaseMilestone(uint256 _jobId, uint256 _milestoneIndex) external onlyEmployer(_jobId) nonReentrant {
        Job storage job = jobs[_jobId];
        Milestone storage milestone = jobMilestones[_jobId][_milestoneIndex];

        require(milestone.status == MilestoneStatus.InReview || milestone.status == MilestoneStatus.Funded, "INVALID_STATUS");

        uint256 payout = milestone.amountUSDC;
        milestone.status = MilestoneStatus.Released;
        milestone.completedAt = block.timestamp;

        (bool success, ) = job.contractor.call{value: payout}("");
        require(success, "USDC_TRANSFER_FAILED");

        emit MilestoneReleased(_jobId, _milestoneIndex, job.contractor, payout);
    }
}
